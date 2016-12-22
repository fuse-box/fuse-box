import "./styles.css"
import "./less/styles.less";
import * as rawStyles from "./less/styles.raw.less";

document.querySelector('.style-example').innerHTML += rawStyles.default;