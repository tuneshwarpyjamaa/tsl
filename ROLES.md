# 🛡️ Secure RBAC Implementation Checklist for The South Line

This document outlines the Role-Based Access Control (RBAC) structure and security best practices to ensure airtight access control for all user roles.

---

## 👥 User Roles and Permissions

| Role        | Description                                                                 |
|-------------|-----------------------------------------------------------------------------|
| **Admin**   | Full control. Can manage users, posts, and categories.                      |
| **Editor**  | Can create, edit, and publish any post. Can also manage categories.         |
| **Contributor** | Can create and edit **only their own** posts. Cannot publish.          |
| **Member**  | Can read all published content. Default for new users.                      |

---

## Centralized Permissions Map (Example)

```js
const permissions = {
  admin: {
    manageUsers: true,
    managePosts: true,
    manageCategories: true,
    publishAnyPost: true,
    editAnyPost: true,
  },
  editor: {
    manageUsers: false,
    managePosts: true,
    manageCategories: true,
    publishAnyPost: true,
    editAnyPost: true,
  },
  contributor: {
    manageUsers: false,
    managePosts: true,
    manageCategories: false,
    publishAnyPost: false,
    editOwnPost: true,
  },
  member: {
    readPublishedPosts: true,
  },
};


Key Access Control Rules

Ownership Enforcement
Contributors can only edit their own posts:

if (user.role === 'contributor' && post.authorId !== user.id) {
  throw new ForbiddenError('You can only manage your own posts.');
}


Guarding Routes with Middleware

function authorize(action) {
  return (req, res, next) => {
    const userRole = req.user.role;
    const allowed = permissions[userRole]?.[action];
    if (!allowed) return res.status(403).json({ error: 'Access denied' });
    next();
  };
}

router.post('/posts', authorize('managePosts'), createPost);


 Role ≠ Permission
Don't hardcode role checks. Instead, check for actions/permissions.

🔄 Role-Based Access Matrix
Action	Admin	Editor	Contributor	Member
Create post	✔️	✔️	✔️ (own)	❌
Edit any post	✔️	✔️	❌	❌
Edit own post	✔️	✔️	✔️	❌
Publish post	✔️	✔️	❌	❌
View drafts	✔️	✔️	❌	❌
Manage categories	✔️	✔️	❌	❌
Manage users	✔️	❌	❌	❌
Read published posts	✔️	✔️	✔️	✔️
🔍 Secure Implementation Best Practices

 RBAC logic is centralized, not scattered.

 UI hides unauthorized actions, but backend strictly enforces them.

 Ownership checks always required for contributor actions.

 Sensitive routes (user management, publishing) are locked to Admins/Editors.

 Role changes can only be performed by Admins.

 Use audit logs for role changes, post publication, and user management.

 Permissions can be managed via action-based keys, not just role checks.

Test Coverage Suggestions

Test access to protected routes for each role.

Test that contributors cannot access/edit/publish others’ posts.

Test attempts to escalate roles via API (e.g., modifying payloads).

Test UI behavior and feedback when permissions are denied.


Final Tips

Never rely on frontend role checks alone.

Validate permissions in every controller or with decorators/middleware.

Regularly audit your permission map and remove unused permissions.

Document role responsibilities clearly for your team.