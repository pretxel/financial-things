export async function GET(_request: Request): Promise<Response> {
  console.log("Cron ejecutado");

  //  Create a process to get financial information and save

  return new Response(JSON.stringify({ message: "Cron success" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
