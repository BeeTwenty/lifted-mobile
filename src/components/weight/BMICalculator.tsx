
import { Card, CardContent } from "@/components/ui/card";

interface BMICalculatorProps {
  weight: number;
  height: number;
}

const BMICalculator = ({ weight, height }: BMICalculatorProps) => {
  // Calculate BMI = weight (kg) / (height (m))^2
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  const roundedBmi = Math.round(bmi * 10) / 10;
  
  // Determine BMI category
  let category: string;
  let color: string;
  
  if (bmi < 18.5) {
    category = "Underweight";
    color = "text-blue-500";
  } else if (bmi >= 18.5 && bmi < 25) {
    category = "Normal weight";
    color = "text-green-500";
  } else if (bmi >= 25 && bmi < 30) {
    category = "Overweight";
    color = "text-orange-500";
  } else {
    category = "Obese";
    color = "text-red-500";
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground">Your BMI</h3>
            <p className={`text-2xl font-bold ${color}`}>
              {roundedBmi}
              <span className="text-sm font-normal text-muted-foreground ml-1">kg/m²</span>
            </p>
            <p className={`${color} font-medium`}>{category}</p>
          </div>
          <div className="text-sm text-muted-foreground text-right">
            <p>Underweight: &lt;18.5</p>
            <p>Normal: 18.5-24.9</p>
            <p>Overweight: 25-29.9</p>
            <p>Obese: ≥30</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BMICalculator;
