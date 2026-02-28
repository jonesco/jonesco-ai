import SwiftUI

struct RecipeListView: View {
    @EnvironmentObject var recipeService: RecipeService
    @State private var searchText = ""
    @State private var showingAddRecipe = false
    @State private var isSearching = false

    var body: some View {
        NavigationStack {
            Group {
                if recipeService.serverURL.isEmpty {
                    NoServerView()
                } else if recipeService.isLoading && recipeService.recipes.isEmpty {
                    ProgressView("Loading recipes…")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else if let error = recipeService.errorMessage {
                    ErrorView(message: error) {
                        Task { await recipeService.fetchRecipes() }
                    }
                } else if recipeService.recipes.isEmpty {
                    EmptyRecipesView()
                } else {
                    recipeList
                }
            }
            .navigationTitle("Recipes")
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        showingAddRecipe = true
                    } label: {
                        Image(systemName: "plus")
                    }
                }
                ToolbarItem(placement: .navigationBarLeading) {
                    Button {
                        Task { await recipeService.fetchRecipes(search: searchText.isEmpty ? nil : searchText) }
                    } label: {
                        Image(systemName: "arrow.clockwise")
                    }
                    .disabled(recipeService.isLoading)
                }
            }
            .searchable(text: $searchText, prompt: "Search recipes…")
            .onSubmit(of: .search) {
                Task { await recipeService.fetchRecipes(search: searchText.isEmpty ? nil : searchText) }
            }
            .onChange(of: searchText) { _, newValue in
                if newValue.isEmpty {
                    Task { await recipeService.fetchRecipes() }
                }
            }
            .sheet(isPresented: $showingAddRecipe) {
                AddRecipeView()
            }
            .task {
                if recipeService.recipes.isEmpty && !recipeService.serverURL.isEmpty {
                    await recipeService.fetchRecipes()
                }
            }
        }
    }

    private var recipeList: some View {
        List {
            if recipeService.isLoading {
                HStack {
                    Spacer()
                    ProgressView()
                    Spacer()
                }
                .listRowBackground(Color.clear)
            }

            ForEach(recipeService.recipes) { recipe in
                NavigationLink(destination: RecipeDetailView(recipe: recipe)) {
                    RecipeRowView(recipe: recipe)
                }
            }
            .onDelete { indexSet in
                Task {
                    for index in indexSet {
                        let id = recipeService.recipes[index].id
                        try? await recipeService.deleteRecipe(id: id)
                    }
                }
            }
        }
        .listStyle(.insetGrouped)
    }
}

// MARK: - Recipe Row

struct RecipeRowView: View {
    let recipe: Recipe

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text(recipe.name)
                .font(.headline)

            HStack(spacing: 12) {
                if let cuisine = recipe.cuisine {
                    Label(cuisine, systemImage: "globe")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                if let time = recipe.formattedTotalTime {
                    Label(time, systemImage: "clock")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
                if let servings = recipe.servings {
                    Label("\(servings)", systemImage: "person.2")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }

            if !recipe.tags.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 4) {
                        ForEach(recipe.tags, id: \.self) { tag in
                            Text(tag)
                                .font(.caption2)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 2)
                                .background(Color.accentColor.opacity(0.15))
                                .foregroundStyle(Color.accentColor)
                                .clipShape(Capsule())
                        }
                    }
                }
            }

            if let source = recipe.source {
                Text("via \(source)")
                    .font(.caption2)
                    .foregroundStyle(.tertiary)
            }
        }
        .padding(.vertical, 4)
    }
}

// MARK: - Supporting Views

struct NoServerView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "server.rack")
                .font(.system(size: 48))
                .foregroundStyle(.secondary)
            Text("No Server Configured")
                .font(.title2.bold())
            Text("Go to Settings and enter your MCP server URL to start saving AI recipes.")
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
                .padding(.horizontal)
        }
    }
}

struct EmptyRecipesView: View {
    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "fork.knife.circle")
                .font(.system(size: 48))
                .foregroundStyle(.secondary)
            Text("No Recipes Yet")
                .font(.title2.bold())
            Text("Ask an AI to save a recipe using the MCP server, or add one manually with the + button.")
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
                .padding(.horizontal)
        }
    }
}

struct ErrorView: View {
    let message: String
    let retry: () -> Void

    var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle")
                .font(.system(size: 48))
                .foregroundStyle(.orange)
            Text("Error")
                .font(.title2.bold())
            Text(message)
                .multilineTextAlignment(.center)
                .foregroundStyle(.secondary)
                .padding(.horizontal)
            Button("Try Again", action: retry)
                .buttonStyle(.borderedProminent)
        }
    }
}

#Preview {
    RecipeListView()
        .environmentObject(RecipeService())
}
