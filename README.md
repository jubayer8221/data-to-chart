# DATA TO CHART
# 🧾 Data Table with Export & State Management

A dynamic and responsive data table built with **Next.js**, **Redux Toolkit**, and **Tailwind CSS**, featuring sorting, real-time updates, row animations, export options, and persistent state management using **redux-persist**.

## 🚀 Features

- ✅ Fully responsive data table layout
- 🔄 Sorting support for columns (ascending/descending)
- 🪄 Smooth row animations with Framer Motion
- 🗃️ Persistent state management with Redux Toolkit + redux-persist
- 💾 Local storage integration to save data
- 📤 Export data functionality (PDF/Image support)
- 📁 Built entirely in **JavaScript**

## 📦 Tech Stack

- **Frontend Framework**: Next.js
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit + redux-persist
- **Animation**: Framer Motion
- **Export Management**: Custom Redux slice (`exportSlice`)
- **Language**: JavaScript (ES6+)

## 📁 Project Structure

src/
├── app/
├── components/
│   └── DataTable.js
├── redux/
│   ├── slices/
│   │   ├── convertDataSlice.js
│   │   └── exportSlice.js
│   ├── store.js
│   └── providers.js
└── styles/

## ⚙️ Setup & Installation

1. Clone the repo
   git clone https://github.com/yourusername/your-repo-name.git
   cd your-repo-name

2. Install dependencies
   npm install

3. Run the development server
   npm run dev

4. Open https://data-to-chart-dusky.vercel.app/ in your browser.


## 🧑‍💻 Author

**Jubayer Al Mahmud**  
BSc in CSE, Green University of Bangladesh  
🌱 Passionate about Web Development, AI, and Cybersecurity  
📫 LinkedIn: https://www.linkedin.com/in/jubayer-al-mahmud-372883225/ 
📧 Email: jubayer8221@gmail.com
