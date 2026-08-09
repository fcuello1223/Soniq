import { prisma } from "@/lib/db";

export default async function TestPage() {
  const voices = await prisma.voice.findMany();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Voices ({voices.length})</h1>
      <ul>
        {voices.map((voice) => {
          return (
            <li key={voice.id}>
              {voice.name} - {voice.variant}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
