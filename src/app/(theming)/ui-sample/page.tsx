import { Button } from "@/components/sample-ui/button";
import { CardA, CardB, CardC } from "@/components/sample-ui/card";

export default function EcommerceSampleUI() {
  return (
    <>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Buttons</h2>
      <div className="flex gap-x-4 gap-y-8 flex-wrap">
        <div className="flex flex-col items-start gap-4">
          <Button variant="default" size="lg">
            Primary
          </Button>
          <Button variant="default">Primary</Button>
          <Button variant="default" size="sm">
            Primary
          </Button>
        </div>
        <div className="flex flex-col items-start gap-4">
          <Button variant="secondary" size="lg">
            Secondary
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="secondary" size="sm">
            Secondary
          </Button>
        </div>
        <div className="flex flex-col items-start gap-4">
          <Button variant="outline" size="lg">
            Outline
          </Button>
          <Button variant="outline">Outline</Button>
          <Button variant="outline" size="sm">
            Outline
          </Button>
        </div>
        <div className="flex flex-col items-start gap-4">
          <Button variant="ghost" size="lg">
            Ghost
          </Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghost" size="sm">
            Ghost
          </Button>
        </div>
        <div className="flex flex-col items-start gap-4">
          <Button variant="link" size="lg">
            Link
          </Button>
          <Button variant="link">Link</Button>
          <Button variant="link" size="sm">
            Link
          </Button>
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-8">Cards</h2>
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <CardA />
        <CardB />
        <CardC />
      </div>
    </>
  );
}
