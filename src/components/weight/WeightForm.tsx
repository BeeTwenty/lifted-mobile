
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface WeightFormProps {
  onAddWeight: (weight: number) => void;
}

const WeightForm = ({ onAddWeight }: WeightFormProps) => {
  const [weight, setWeight] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0) return;
    
    onAddWeight(weightValue);
    setWeight("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="weight">Current Weight (kg)</Label>
        <div className="flex mt-1">
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder="Enter weight"
            className="rounded-r-none"
            required
          />
          <Button type="submit" className="rounded-l-none">
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default WeightForm;
