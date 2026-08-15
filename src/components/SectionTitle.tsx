export default function SectionTitle({
  subtitle,
  title,
  align = "center",
}: {
  subtitle: string;
  title: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`mb-16 ${align === "center" ? "text-center" : "text-left"}`}>
      <span className="inline-block text-amber-accent text-sm font-bold tracking-widest uppercase mb-3">
        {subtitle}
      </span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
        {title}
      </h2>
      <div
        className={`mt-4 h-1 w-16 bg-gradient-to-r from-blue-primary to-amber-accent rounded-full ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
    </div>
  );
}
