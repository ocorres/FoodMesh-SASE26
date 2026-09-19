import Link from "next/link";

export default function ShareFoodPage() {
  return (
    <main id="main" className="shell page-shell">
      <Link className="back-link" href="/">← FoodMesh home</Link>
      <p className="kicker">Share food</p>
      <h1>Tell us what you have.</h1>
      <p className="lede narrow">Start with a photo or a short description. We will make the listing easier from there.</p>

      <form className="form-card">
        <label htmlFor="photo">Food photo</label>
        <input id="photo" name="photo" type="file" accept="image/*" />

        <label htmlFor="description">Or describe the food</label>
        <textarea id="description" name="description" rows={5} placeholder="Example: About 30 boxed sandwiches and fruit from tonight's hotel conference." />

        <label htmlFor="deadline">When does it need to be picked up?</label>
        <input id="deadline" name="deadline" type="text" placeholder="Tonight by 9 PM" />

        <button className="button" type="submit">Continue</button>
      </form>
    </main>
  );
}
