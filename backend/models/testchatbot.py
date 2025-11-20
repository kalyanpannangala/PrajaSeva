import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()
load_dotenv(".env")
load_dotenv(".env.local")

API_KEY = os.getenv("GEMINI_API_KEY")

print("====================================")
print("🔍 Gemini API Connectivity Test Tool")
print("====================================")

# 1. Check the API key
if not API_KEY:
    print("❌ ERROR: No GEMINI_API_KEY found in .env or environment variables.")
    print("→ Please add GEMINI_API_KEY=your_key_here to your .env file")
    exit()

print(f"✅ API key loaded: {API_KEY[:6]}******")

# 2. Try initializing the model
try:
    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel("gemini-2.5-flash-preview-09-2025")
    print("✅ Gemini model initialized successfully!\n")
except Exception as e:
    print("❌ FAILED to initialize Gemini model.")
    print("Error:", e)
    exit()

print("------------------------------------")
print("Enter a prompt to send to Gemini LLM")
print("(type 'exit' to quit)")
print("------------------------------------")

# 3. Start input→response loop
while True:
    user_input = input("\n📝 Your prompt: ").strip()

    if user_input.lower() in ["exit", "quit"]:
        print("👋 Exiting Gemini test tool.")
        break

    if not user_input:
        print("⚠️ Please type something.")
        continue

    print("⏳ Sending request to Gemini...\n")

    try:
        response = model.generate_content(user_input)

        # Extract response text safely
        reply = getattr(response, "text", None) or getattr(response, "content", None)

        print("🤖 Gemini Response:")
        print("────────────────────────────────────")
        if reply:
            print(reply)
        else:
            print("⚠️ Unexpected response structure:", response)

    except Exception as e:
        print("❌ ERROR while calling Gemini API:")
        print(str(e))
