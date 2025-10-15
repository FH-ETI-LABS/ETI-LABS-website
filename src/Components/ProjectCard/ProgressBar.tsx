import "../../Pages/LabProjects.css";

/**
 * @interface Props
 * @property {number} completion - The percentage value (0-100) to fill the progress bar.
 */
interface Props {
  completion: number;
}

/**
 * ProgressBar Component
 * A visual component that displays a horizontal progress bar.
 * The fill color is a dark red to match the design.
 */
const ProgressBar = ({ completion }: Props) => {
  return (
    <div
      className="progress-bar-fill"
      style={{ width: `${completion}%` }}
    ></div>
  );
};

export default ProgressBar;
