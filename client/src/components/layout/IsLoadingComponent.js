import classes from "./IsLoadingComponent.module.css";

const IsLoadingComponent = () => {
  return (
    <main className={classes.main}>
      <div className={classes.loading}></div>
    </main>
  );
};

export default IsLoadingComponent;
