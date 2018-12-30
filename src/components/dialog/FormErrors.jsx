import React from "react";

export const FormErrors = ({ formErrors }) => (
  <div className="formErrors">
    {Object.keys(formErrors).map((fieldName, i) => {
      if (formErrors[fieldName].length > 0) {
        let name = fieldName;
        if (
          name === "amount" ||
          name === "rate" ||
          name === "resetDate" ||
          name === "totaltAmnt"
        )
          name = "";
        return (
          <p key={i}>
            {name} {formErrors[fieldName]}
          </p>
        );
      } else {
        return "";
      }
    })}
  </div>
);
