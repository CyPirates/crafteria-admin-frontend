const convertMaterialName = (target: string) => {
    let engPattern = /[a-zA-Z]/;
    let isEng = engPattern.test(target);

    if (isEng) {
        switch (target) {
            case "FILAMENT":
                return "필라멘트트";
            case "LIQUID":
                return "액체";
            default:
                return "분말";
        }
    } else {
        switch (target) {
            case "필라멘트":
                return "FILAMENT";
            case "액체":
                return "LIQUID";
            default:
                return "POWDER";
        }
    }
};

export default convertMaterialName;
