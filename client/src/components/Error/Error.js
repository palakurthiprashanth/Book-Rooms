import React from "react";

export default function Error({ error }) {
  return (
    <div>
      <div className="alert alert-danger" role="alert">
        Something Went Wrong !!
      </div>
    </div>
  );
}
