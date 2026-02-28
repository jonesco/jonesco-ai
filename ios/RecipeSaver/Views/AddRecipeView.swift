import SwiftUI

struct AddRecipeView: View {
    @EnvironmentObject var recipeService: RecipeService
    @Environment(\.dismiss) var dismiss

    @State private var name = ""
    @State private var description = ""
    @State private var ingredientsText = ""   // one per line
    @State private var instructionsText = ""  // one per line
    @State private var prepTime = ""
    @State private var cookTime = ""
    @State private var servings = ""
    @State private var cuisine = ""
    @State private var tagsText = ""          // comma-separated
    @State private var isSaving = false
    @State private var errorMessage: String?

    private var isValid: Bool {
        !name.trimmingCharacters(in: .whitespaces).isEmpty &&
        !ingredientsText.trimmingCharacters(in: .whitespaces).isEmpty &&
        !instructionsText.trimmingCharacters(in: .whitespaces).isEmpty
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Recipe Name") {
                    TextField("e.g. Chicken Tikka Masala", text: $name)
                }

                Section("Description (optional)") {
                    TextField("Brief description…", text: $description, axis: .vertical)
                        .lineLimit(2...4)
                }

                Section {
                    TextField("One ingredient per line\ne.g.\n2 cups flour\n1 tsp salt", text: $ingredientsText, axis: .vertical)
                        .lineLimit(4...10)
                        .font(.body.monospaced())
                } header: {
                    Text("Ingredients")
                } footer: {
                    Text("Enter one ingredient per line.")
                }

                Section {
                    TextField("One step per line\ne.g.\nPreheat oven to 350°F.\nMix dry ingredients.", text: $instructionsText, axis: .vertical)
                        .lineLimit(4...12)
                        .font(.body.monospaced())
                } header: {
                    Text("Instructions")
                } footer: {
                    Text("Enter one step per line.")
                }

                Section("Times & Servings") {
                    HStack {
                        Text("Prep")
                        Spacer()
                        TextField("mins", text: $prepTime)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 80)
                    }
                    HStack {
                        Text("Cook")
                        Spacer()
                        TextField("mins", text: $cookTime)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 80)
                    }
                    HStack {
                        Text("Servings")
                        Spacer()
                        TextField("4", text: $servings)
                            .keyboardType(.numberPad)
                            .multilineTextAlignment(.trailing)
                            .frame(width: 80)
                    }
                }

                Section("Cuisine") {
                    TextField("e.g. Italian, Mexican, Thai", text: $cuisine)
                }

                Section {
                    TextField("e.g. vegetarian, quick, dessert", text: $tagsText)
                } header: {
                    Text("Tags")
                } footer: {
                    Text("Comma-separated tags.")
                }

                if let error = errorMessage {
                    Section {
                        Text(error)
                            .foregroundStyle(.red)
                    }
                }
            }
            .navigationTitle("Add Recipe")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        Task { await save() }
                    }
                    .disabled(!isValid || isSaving)
                    .overlay {
                        if isSaving { ProgressView() }
                    }
                }
            }
        }
    }

    private func save() async {
        isSaving = true
        defer { isSaving = false }
        errorMessage = nil

        let ingredients = ingredientsText
            .components(separatedBy: .newlines)
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }

        let instructions = instructionsText
            .components(separatedBy: .newlines)
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }

        let tags = tagsText
            .components(separatedBy: ",")
            .map { $0.trimmingCharacters(in: .whitespaces) }
            .filter { !$0.isEmpty }

        let input = RecipeInput(
            name:         name.trimmingCharacters(in: .whitespaces),
            description:  description.isEmpty ? nil : description.trimmingCharacters(in: .whitespaces),
            ingredients:  ingredients,
            instructions: instructions,
            prepTime:     Int(prepTime),
            cookTime:     Int(cookTime),
            servings:     Int(servings),
            cuisine:      cuisine.isEmpty ? nil : cuisine.trimmingCharacters(in: .whitespaces),
            tags:         tags
        )

        do {
            _ = try await recipeService.createRecipe(input)
            dismiss()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

#Preview {
    AddRecipeView()
        .environmentObject(RecipeService())
}
