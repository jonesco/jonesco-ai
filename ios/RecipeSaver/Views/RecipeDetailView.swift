import SwiftUI

struct RecipeDetailView: View {
    let recipe: Recipe
    @EnvironmentObject var recipeService: RecipeService
    @Environment(\.dismiss) var dismiss
    @State private var showDeleteAlert = false

    var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 20) {

                // Header
                headerSection

                Divider()

                // Ingredients
                if !recipe.ingredients.isEmpty {
                    ingredientsSection
                    Divider()
                }

                // Instructions
                if !recipe.instructions.isEmpty {
                    instructionsSection
                    Divider()
                }

                // Tags
                if !recipe.tags.isEmpty {
                    tagsSection
                    Divider()
                }

                // Metadata
                metadataSection
            }
            .padding()
        }
        .navigationTitle(recipe.name)
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .navigationBarTrailing) {
                Button(role: .destructive) {
                    showDeleteAlert = true
                } label: {
                    Image(systemName: "trash")
                }
            }
        }
        .alert("Delete Recipe?", isPresented: $showDeleteAlert) {
            Button("Delete", role: .destructive) {
                Task {
                    try? await recipeService.deleteRecipe(id: recipe.id)
                    dismiss()
                }
            }
            Button("Cancel", role: .cancel) {}
        } message: {
            Text(""\(recipe.name)" will be permanently deleted.")
        }
    }

    // MARK: - Sections

    private var headerSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            if let description = recipe.description {
                Text(description)
                    .font(.body)
                    .foregroundStyle(.secondary)
            }

            // Stats row
            HStack(spacing: 20) {
                if let time = recipe.formattedTotalTime {
                    StatBadge(icon: "clock", label: "Total", value: time)
                }
                if let prep = recipe.formattedPrepTime {
                    StatBadge(icon: "timer", label: "Prep", value: prep)
                }
                if let cook = recipe.formattedCookTime {
                    StatBadge(icon: "flame", label: "Cook", value: cook)
                }
                if let servings = recipe.servings {
                    StatBadge(icon: "person.2", label: "Serves", value: "\(servings)")
                }
            }

            if let cuisine = recipe.cuisine {
                Label(cuisine, systemImage: "globe")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
    }

    private var ingredientsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Ingredients")
                .font(.title3.bold())

            ForEach(Array(recipe.ingredients.enumerated()), id: \.offset) { _, ingredient in
                HStack(alignment: .top, spacing: 8) {
                    Image(systemName: "circle.fill")
                        .font(.system(size: 6))
                        .foregroundStyle(.accentColor)
                        .padding(.top, 6)
                    Text(ingredient)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
        }
    }

    private var instructionsSection: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Instructions")
                .font(.title3.bold())

            ForEach(Array(recipe.instructions.enumerated()), id: \.offset) { index, step in
                HStack(alignment: .top, spacing: 12) {
                    Text("\(index + 1)")
                        .font(.headline)
                        .foregroundStyle(.white)
                        .frame(width: 28, height: 28)
                        .background(Color.accentColor)
                        .clipShape(Circle())

                    Text(step)
                        .fixedSize(horizontal: false, vertical: true)
                        .padding(.top, 4)
                }
            }
        }
    }

    private var tagsSection: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("Tags")
                .font(.title3.bold())

            FlowLayout(spacing: 6) {
                ForEach(recipe.tags, id: \.self) { tag in
                    Text(tag)
                        .font(.subheadline)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(Color.accentColor.opacity(0.15))
                        .foregroundStyle(Color.accentColor)
                        .clipShape(Capsule())
                }
            }
        }
    }

    private var metadataSection: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Details")
                .font(.title3.bold())

            if let source = recipe.source {
                LabeledContent("Source", value: source)
                    .font(.subheadline)
            }

            LabeledContent("Saved", value: formattedDate(recipe.createdAt))
                .font(.subheadline)

            LabeledContent("ID", value: recipe.id)
                .font(.caption)
                .foregroundStyle(.secondary)
        }
    }

    private func formattedDate(_ iso: String) -> String {
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        if let date = formatter.date(from: iso) {
            return date.formatted(date: .abbreviated, time: .shortened)
        }
        // Fallback for SQLite datetime format
        let fallback = DateFormatter()
        fallback.dateFormat = "yyyy-MM-dd HH:mm:ss"
        if let date = fallback.date(from: iso) {
            return date.formatted(date: .abbreviated, time: .shortened)
        }
        return iso
    }
}

// MARK: - Supporting Views

struct StatBadge: View {
    let icon: String
    let label: String
    let value: String

    var body: some View {
        VStack(spacing: 2) {
            Image(systemName: icon)
                .font(.caption)
                .foregroundStyle(.secondary)
            Text(value)
                .font(.headline)
            Text(label)
                .font(.caption2)
                .foregroundStyle(.secondary)
        }
        .frame(minWidth: 60)
        .padding(.vertical, 8)
        .padding(.horizontal, 10)
        .background(Color(.systemGroupedBackground))
        .clipShape(RoundedRectangle(cornerRadius: 10))
    }
}

/// Simple flow layout for tags
struct FlowLayout: Layout {
    var spacing: CGFloat = 8

    func sizeThatFits(proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) -> CGSize {
        let rows = computeRows(proposal: proposal, subviews: subviews)
        return rows.reduce(CGSize.zero) { result, row in
            let rowWidth  = row.reduce(0) { $0 + $1.sizeThatFits(.unspecified).width } + spacing * CGFloat(max(row.count - 1, 0))
            let rowHeight = row.map { $0.sizeThatFits(.unspecified).height }.max() ?? 0
            return CGSize(
                width:  max(result.width, rowWidth),
                height: result.height + rowHeight + (result.height > 0 ? spacing : 0)
            )
        }
    }

    func placeSubviews(in bounds: CGRect, proposal: ProposedViewSize, subviews: Subviews, cache: inout ()) {
        let rows = computeRows(proposal: proposal, subviews: subviews)
        var y = bounds.minY
        for row in rows {
            var x = bounds.minX
            let rowHeight = row.map { $0.sizeThatFits(.unspecified).height }.max() ?? 0
            for subview in row {
                let size = subview.sizeThatFits(.unspecified)
                subview.place(at: CGPoint(x: x, y: y), proposal: .unspecified)
                x += size.width + spacing
            }
            y += rowHeight + spacing
        }
    }

    private func computeRows(proposal: ProposedViewSize, subviews: Subviews) -> [[LayoutSubview]] {
        let maxWidth = proposal.width ?? .infinity
        var rows: [[LayoutSubview]] = [[]]
        var rowWidth: CGFloat = 0

        for subview in subviews {
            let size = subview.sizeThatFits(.unspecified)
            if rowWidth + size.width > maxWidth && !rows[rows.count - 1].isEmpty {
                rows.append([])
                rowWidth = 0
            }
            rows[rows.count - 1].append(subview)
            rowWidth += size.width + spacing
        }
        return rows
    }
}

#Preview {
    NavigationStack {
        RecipeDetailView(recipe: Recipe(
            id: "preview-id",
            name: "Classic Spaghetti Carbonara",
            description: "A rich and creamy Italian pasta dish.",
            ingredients: ["400g spaghetti", "200g pancetta", "4 eggs", "100g Pecorino Romano", "Black pepper"],
            instructions: ["Cook pasta al dente.", "Fry pancetta until crispy.", "Mix eggs and cheese.", "Combine everything off heat."],
            prepTime: 10,
            cookTime: 20,
            servings: 4,
            cuisine: "Italian",
            tags: ["pasta", "quick", "classic"],
            source: "Claude",
            imageUrl: nil,
            createdAt: "2026-02-28T00:00:00",
            updatedAt: "2026-02-28T00:00:00"
        ))
    }
    .environmentObject(RecipeService())
}
