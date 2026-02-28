import SwiftUI

struct ContentView: View {
    @EnvironmentObject var recipeService: RecipeService

    var body: some View {
        TabView {
            RecipeListView()
                .tabItem {
                    Label("Recipes", systemImage: "fork.knife")
                }

            SettingsView()
                .tabItem {
                    Label("Settings", systemImage: "gear")
                }
        }
        .onAppear {
            // Show setup prompt if no server configured
            if recipeService.serverURL.isEmpty {
                // Settings tab will guide the user
            }
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(RecipeService())
}
