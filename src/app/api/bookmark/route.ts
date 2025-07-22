import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { url, access_token } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(access_token);

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user_id = user.id;

  try {
    // 1. Clean & encode URL
    let formattedUrl = url.trim();

    // If the URL doesn't start with http:// or https://, prepend https://
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const encoded = encodeURIComponent(formattedUrl);
    const summaryRes = await fetch(`https://r.jina.ai/${encoded}`);
    const summary = await summaryRes.text();

    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname;
    const favicon = `https://${domain}/favicon.ico`;

    const metaRes = await fetch(url);
    const metaHtml = await metaRes.text();
    const titleMatch = metaHtml.match(/<title>(.*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1] : url;

    // 2. Save to Supabase
    const { error: insertError } = await supabase.from("bookmarks").insert([
      {
        user_id,
        url,
        title,
        favicon,
        summary,
      },
    ]);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}
