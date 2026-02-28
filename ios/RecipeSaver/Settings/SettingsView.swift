import SwiftUI

struct SettingsView: View {
    @EnvironmentObject var recipeService: RecipeService
    @State private var serverURL: String = ""
    @State private var showSavedConfirmation = false
    @State private var isTestingConnection = false
    @State private var connectionStatus: ConnectionStatus = .idle

    enum ConnectionStatus {
        case idle, testing, success(Int), failure(String)
    }

    var body: some View {
        NavigationStack {
            Form {
                // Server URL
                Section {
                    TextField("https://your-server.onrender.com", text: $serverURL)
                        .keyboardType(.URL)
                        .autocapitalization(.none)
                        .autocorrectionDisabled()
                        .textContentType(.URL)

                    Button {
                        Task { await testConnection() }
                    } label: {
                        if isTestingConnection {
                            HStack {
                                ProgressView()
                                Text("Testing…")
                            }
                        } else {
                            Text("Test Connection")
                        }
                    }
                    .disabled(serverURL.isEmpty || isTestingConnection)

                    if case .success(let count) = connectionStatus {
                        Label("Connected — \(count) recipe\(count == 1 ? "" : "s") saved", systemImage: "checkmark.circle.fill")
                            .foregroundStyle(.green)
                            .font(.subheadline)
                    } else if case .failure(let msg) = connectionStatus {
                        Label(msg, systemImage: "xmark.circle.fill")
                            .foregroundStyle(.red)
                            .font(.subheadline)
                    }

                    Button("Save") {
                        recipeService.serverURL = serverURL.trimmingCharacters(in: .whitespacesAndNewlines)
                        showSavedConfirmation = true
                        Task { await recipeService.fetchRecipes() }
                    }
                    .disabled(serverURL.isEmpty)
                } header: {
                    Text("MCP Server URL")
                } footer: {
                    Text("Enter the URL of your deployed Recipe Saver MCP server. You can deploy it for free on Render.com.")
                }

                // MCP Setup Instructions
                Section("Connect an AI") {
                    InstructionRow(
                        icon: "1.circle.fill",
                        text: "Deploy the server from this repo to Render.com (free tier works great)."
                    )
                    InstructionRow(
                        icon: "2.circle.fill",
                        text: "Copy your server URL (e.g. https://recipe-saver-mcp.onrender.com) and paste it above."
                    )
                    InstructionRow(
                        icon: "3.circle.fill",
                        text: "In Claude Desktop, add this MCP server under Settings → Developer → MCP Servers."
                    )
                    InstructionRow(
                        icon: "4.circle.fill",
                        text: "Ask Claude to save any recipe! It will appear here automatically."
                    )
                }

                // Claude Desktop config snippet
                Section {
                    VStack(alignment: .leading, spacing: 8) {
                        Text("claude_desktop_config.json")
                            .font(.caption.monospaced())
                            .foregroundStyle(.secondary)

                        let config = mcpConfig
                        Text(config)
                            .font(.caption.monospaced())
                            .textSelection(.enabled)
                            .padding(10)
                            .background(Color(.systemGroupedBackground))
                            .clipShape(RoundedRectangle(cornerRadius: 8))

                        Button {
                            UIPasteboard.general.string = config
                        } label: {
                            Label("Copy Config", systemImage: "doc.on.doc")
                                .font(.subheadline)
                        }
                    }
                } header: {
                    Text("Claude Desktop Config")
                } footer: {
                    Text("Add this to your Claude Desktop MCP config file to enable recipe saving from Claude.")
                }

                // App version
                Section {
                    LabeledContent("Version", value: "1.0.0")
                    LabeledContent("Server", value: recipeService.serverURL.isEmpty ? "Not configured" : recipeService.serverURL)
                        .lineLimit(1)
                        .truncationMode(.middle)
                } header: {
                    Text("About")
                }
            }
            .navigationTitle("Settings")
            .onAppear {
                serverURL = recipeService.serverURL
            }
            .alert("Settings Saved", isPresented: $showSavedConfirmation) {
                Button("OK", role: .cancel) {}
            } message: {
                Text("Server URL updated. Fetching your recipes…")
            }
        }
    }

    private var mcpConfig: String {
        let url = serverURL.isEmpty ? "https://your-server.onrender.com" : serverURL
        return """
{
  "mcpServers": {
    "recipe-saver": {
      "url": "\(url)/sse",
      "transport": "sse"
    }
  }
}
"""
    }

    private func testConnection() async {
        isTestingConnection = true
        connectionStatus = .testing
        defer { isTestingConnection = false }

        let trimmed = serverURL.trimmingCharacters(in: .whitespacesAndNewlines)
        guard let url = URL(string: "\(trimmed)/api/recipes") else {
            connectionStatus = .failure("Invalid URL format")
            return
        }

        do {
            let (data, response) = try await URLSession.shared.data(from: url)
            guard let http = response as? HTTPURLResponse, http.statusCode == 200 else {
                connectionStatus = .failure("Server returned an error")
                return
            }
            let result = try JSONDecoder().decode(RecipeListResponse.self, from: data)
            connectionStatus = .success(result.total)
        } catch {
            connectionStatus = .failure("Cannot reach server: \(error.localizedDescription)")
        }
    }
}

struct InstructionRow: View {
    let icon: String
    let text: String

    var body: some View {
        HStack(alignment: .top, spacing: 10) {
            Image(systemName: icon)
                .foregroundStyle(.accentColor)
                .frame(width: 24)
            Text(text)
                .font(.subheadline)
                .fixedSize(horizontal: false, vertical: true)
        }
        .padding(.vertical, 2)
    }
}

#Preview {
    SettingsView()
        .environmentObject(RecipeService())
}
