import { Button } from "@/components/sample-ui/button";

export default function EcommerceSampleUI() {
  return (
    <div className="flex gap-x-4 gap-y-8 flex-wrap">
      <div className="flex flex-col items-start gap-4">
        <Button variant="default" size="lg">Primary</Button>
        <Button variant="default">Primary</Button>
        <Button variant="default" size="sm">Primary</Button>
      </div>
      <div className="flex flex-col items-start gap-4">
        <Button variant="secondary" size="lg">Secondary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="secondary" size="sm">Secondary</Button>
      </div>
      <div className="flex flex-col items-start gap-4">
        <Button variant="outline" size="lg">Outline</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="outline" size="sm">Outline</Button>
      </div>
      <div className="flex flex-col items-start gap-4">
        <Button variant="ghost" size="lg">Ghost</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="ghost" size="sm">Ghost</Button>
      </div>
      <div className="flex flex-col items-start gap-4">
        <Button variant="link" size="lg">Link</Button>
        <Button variant="link">Link</Button>
        <Button variant="link" size="sm">Link</Button>
      </div>
    </div>
  );
}
