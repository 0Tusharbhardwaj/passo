# 🔐 Passo – Your Secure Password Manager

Passo is a modern, minimalistic, and secure password manager built using **React + Vite**, with support for both **Local Storage** and **Cloud Storage (Supabase)**. It allows users to store, manage, and secure their credentials with an intuitive interface and seamless authentication.

🌐 **Live App**: [https://passo-two.vercel.app/](https://passo-two.vercel.app/)

---

## 🚀 Features

### 🧠 Dual Storage Modes
- 🔒 **Local Storage** (default, no login required)
- ☁️ **Cloud Storage** via Supabase:
  - Secure login/logout
  - Sync passwords across devices
  - Persistent sessions

### 🔐 Authentication
- Email/password auth using Supabase
- Auth modal with toggle between login and sign-up
- User session management
- Automatic fallback to Local mode when not signed in

### 🖌️ UI & UX
- Responsive and clean Tailwind-based layout
- Header displays:
  - User’s email
  - Current storage mode (Local or Cloud)
- Beautiful modals:
  - `AuthModal`: login/sign-up
  - `StorageModeModal`: switch storage types
- Password visibility toggle
- Realtime form validations and feedback

---

## 🧰 Tech Stack

| Technology        | Purpose                             |
|------------------|-------------------------------------|
| **React + Vite** | Frontend Framework + Build Tool     |
| **Tailwind CSS** | Utility-first styling               |
| **Supabase**     | Auth + Cloud DB + RLS security      |
| **Lucide Icons** | Consistent and elegant iconography  |
| **CryptoJS**     | (Optional) For password encryption  |

---

## ⚙️ Local Setup

### 🔁 Clone the Repository

```bash
git clone https://github.com/0Tusharbhardwaj/passo.git
cd passo
npm install
🧪 Run the App Locally
bash
Copy
Edit
npm run dev
Then visit: http://localhost:5173

☁️ Supabase Cloud Setup
Create an account at https://supabase.com and start a new project.

In the SQL Editor, paste the following:

sql
Copy
Edit
create table passwords (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text,
  username text,
  password text,
  created_at timestamptz default now()
);

alter table passwords enable row level security;

create policy "Allow logged-in read/write access"
on passwords
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
Go to Project > API and copy:

Project URL

Anon Public Key

Create a .env file in your project root:

env
Copy
Edit
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
🌐 Deploy to Vercel
Already deployed here:
🔗 https://passo-two.vercel.app/

If deploying fresh:

Connect your repo on https://vercel.com

Set environment variables under project settings:

VITE_SUPABASE_URL

VITE_SUPABASE_ANON_KEY

Use default build settings:

Build Command: npm run build

Output Directory: dist

📝 Roadmap
 Master password encryption

 Export/import vault data (CSV or JSON)

 Biometric/PIN unlock (PWA support)

 Tag-based vault organization

 Dark mode

🙌 Acknowledgements


Built by Tushar Bhardwaj with ❤️

📜 License
This project is licensed under the MIT License.

yaml
Copy
Edit

---

✅ **You can copy this into your `README.md`** and push it to your GitHub repo.

Let me know if you want:
- A **logo or icon** for branding
- A **project badge** (e.g. Vercel Deploy / Made with Supabase)
- A `contributing.md` file

Happy launching, Tushar! 🚀
