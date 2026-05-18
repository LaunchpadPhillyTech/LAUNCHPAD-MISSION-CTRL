export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
      <p className="text-lg text-muted-foreground mb-8">Sorry, the page you are looking for does not exist.</p>
      <a href="/dashboard" className="text-primary underline font-semibold">Return to Dashboard</a>
    </div>
  );
}


