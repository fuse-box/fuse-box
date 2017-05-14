import { ResponsiveAPI } from "../../plugins/optimised-api/lib/ResponsiveAPI";

export class ResponsiveAPITest {
    "Should create a simple univeral API"() {
        const api = new ResponsiveAPI();
        console.log(api.render());
    }
}