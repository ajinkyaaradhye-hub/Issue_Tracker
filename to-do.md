CORS
app.use(cors({ origin: "\*" }));

✅ Allows cross-origin requests.

⚠️ In production, you should replace "\*" with your frontend domain, e.g.:

app.use(cors({ origin: ["https://your-frontend.vercel.app"], credentials: true }));
