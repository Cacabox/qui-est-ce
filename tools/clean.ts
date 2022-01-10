import del from "del";
import path from "path";

(async() => {
    await del([path.resolve(__dirname, "../dist/*")]);
})();
