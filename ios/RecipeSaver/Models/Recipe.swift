import Foundation

struct Recipe: Identifiable, Codable, Hashable {
    let id: String
    let name: String
    let description: String?
    let ingredients: [String]
    let instructions: [String]
    let prepTime: Int?
    let cookTime: Int?
    let servings: Int?
    let cuisine: String?
    let tags: [String]
    let source: String?
    let imageUrl: String?
    let createdAt: String
    let updatedAt: String

    enum CodingKeys: String, CodingKey {
        case id, name, description, ingredients, instructions
        case prepTime, cookTime, servings, cuisine, tags, source
        case imageUrl, createdAt, updatedAt
    }

    var totalTimeMinutes: Int? {
        let p = prepTime ?? 0
        let c = cookTime ?? 0
        let total = p + c
        return total > 0 ? total : nil
    }

    var formattedTotalTime: String? {
        guard let total = totalTimeMinutes else { return nil }
        if total >= 60 {
            let h = total / 60
            let m = total % 60
            return m > 0 ? "\(h)h \(m)m" : "\(h)h"
        }
        return "\(total)m"
    }

    var formattedPrepTime: String? {
        guard let t = prepTime, t > 0 else { return nil }
        return t >= 60 ? "\(t/60)h \(t%60 > 0 ? "\(t%60)m" : "")" : "\(t)m"
    }

    var formattedCookTime: String? {
        guard let t = cookTime, t > 0 else { return nil }
        return t >= 60 ? "\(t/60)h \(t%60 > 0 ? "\(t%60)m" : "")" : "\(t)m"
    }
}

struct RecipeListResponse: Codable {
    let recipes: [Recipe]
    let total: Int
}
