```mermaid
erDiagram
    User {
        string id PK
        string name
        string email UK
        string password
        enum provider
        string oauthId
        enum role
        enum status
        string[] permissions
        datetime createdAt
        datetime updatedAt
    }

    User ||--o{ AuthProvider : has
    User ||--o{ UserRole : has
    User ||--o{ UserStatus : has

    enum AuthProvider {
        LOCAL
        GOOGLE
        GITHUB
    }

    enum UserRole {
        ADMIN
        USER
    }

    enum UserStatus {
        ACTIVE
        INACTIVE
        SUSPENDED
    }
```
