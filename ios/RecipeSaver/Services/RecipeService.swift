import Foundation

@MainActor
class RecipeService: ObservableObject {
    @Published var recipes: [Recipe] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    // Server URL stored in UserDefaults so the user can configure it in Settings
    var serverURL: String {
        get { UserDefaults.standard.string(forKey: "serverURL") ?? "" }
        set { UserDefaults.standard.set(newValue, forKey: "serverURL") }
    }

    private var baseURL: String {
        let url = serverURL.trimmingCharacters(in: .whitespacesAndNewlines)
        return url.isEmpty ? "http://localhost:3000" : url
    }

    // MARK: - Public methods

    func fetchRecipes(search: String? = nil) async {
        isLoading = true
        errorMessage = nil
        defer { isLoading = false }

        var urlString = "\(baseURL)/api/recipes"
        if let search, !search.isEmpty,
           let encoded = search.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) {
            urlString += "?q=\(encoded)"
        }

        guard let url = URL(string: urlString) else {
            errorMessage = "Invalid server URL: \(urlString)"
            return
        }

        do {
            let (data, response) = try await URLSession.shared.data(from: url)
            try validateResponse(response)
            let result = try decoder.decode(RecipeListResponse.self, from: data)
            recipes = result.recipes
        } catch {
            errorMessage = errorDescription(error)
        }
    }

    func fetchRecipe(id: String) async throws -> Recipe {
        guard let url = URL(string: "\(baseURL)/api/recipes/\(id)") else {
            throw URLError(.badURL)
        }
        let (data, response) = try await URLSession.shared.data(from: url)
        try validateResponse(response)
        return try decoder.decode(Recipe.self, from: data)
    }

    func createRecipe(_ input: RecipeInput) async throws -> Recipe {
        guard let url = URL(string: "\(baseURL)/api/recipes") else {
            throw URLError(.badURL)
        }
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(input)

        let (data, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response)
        let recipe = try decoder.decode(Recipe.self, from: data)
        recipes.insert(recipe, at: 0)
        return recipe
    }

    func deleteRecipe(id: String) async throws {
        guard let url = URL(string: "\(baseURL)/api/recipes/\(id)") else {
            throw URLError(.badURL)
        }
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"

        let (_, response) = try await URLSession.shared.data(for: request)
        try validateResponse(response)
        recipes.removeAll { $0.id == id }
    }

    // MARK: - Helpers

    private let decoder: JSONDecoder = {
        let d = JSONDecoder()
        d.keyDecodingStrategy = .convertFromSnakeCase
        return d
    }()

    private func validateResponse(_ response: URLResponse) throws {
        guard let http = response as? HTTPURLResponse else { return }
        guard (200...299).contains(http.statusCode) else {
            throw URLError(.badServerResponse)
        }
    }

    private func errorDescription(_ error: Error) -> String {
        if let urlError = error as? URLError {
            switch urlError.code {
            case .cannotConnectToHost, .networkConnectionLost:
                return "Cannot connect to server. Check the URL in Settings."
            case .timedOut:
                return "Request timed out. Server may be slow to start."
            default:
                return urlError.localizedDescription
            }
        }
        return error.localizedDescription
    }
}

// MARK: - RecipeInput (for creating recipes from the app)

struct RecipeInput: Codable {
    var name: String
    var description: String?
    var ingredients: [String]
    var instructions: [String]
    var prepTime: Int?
    var cookTime: Int?
    var servings: Int?
    var cuisine: String?
    var tags: [String]
    var source: String = "iOS App"
}
