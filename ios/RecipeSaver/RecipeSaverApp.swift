import SwiftUI

@main
struct RecipeSaverApp: App {
    @StateObject private var recipeService = RecipeService()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(recipeService)
        }
    }
}
