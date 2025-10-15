/**
 * FeatureCard Component
 * ---------------------
 * Represents a clickable card (styled as a button) that links to different
 * sections of the Foothill ETI Labs website.
 *
 * This component is reusable and accepts props for:
 * - `title`: the name of the section or page it represents.
 * Styling is defined separately in `FeatureCard.css`.
 */

import "./FeatureCard.css";

/**
 * Renders a single red feature card with white text.
 * Intended for use on the home page grid to represent different navigation options.
 */
function FeatureCard({ title }: { title: string }) {
  return <button className="feature-card">{title}</button>;
}

export default FeatureCard;
