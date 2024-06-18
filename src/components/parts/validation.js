export default function Validation(values) {
    console.log(values);
    const errors = {}
    const email_pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    // const pass_pattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    if(values.full_name === ""){
        errors.nameerr = "Full Name is required";
    }
    if(values.school_name === ""){
        errors.schoolerr = "School Name is required";
    }
    if(values.position === ""){
        errors.poerr = "Position is required";
    }
    if(values.giv_email === ""){
        errors.emailerr = "Email is required";
    }
    if (values.giv_email){
        if (!email_pattern.test(values.giv_email)) {
            errors.emailerr = "Invalid email format";
        }
    }
    if(values.phone_number === ""){
        errors.numerr = "Phone number is required";
    }
    if(values.interest == ""){
        errors.interesterr = "Select atleast one interest";
    }
    return errors;
}