import "./styles.css"
import "./less/styles.less";

const rawStyles = require("./less/styles.raw.less?raw")
document.querySelector('.style-example').innerHTML += rawStyles.default;