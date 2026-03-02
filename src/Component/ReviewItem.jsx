import React from 'react'

const ReviewItem = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="font-semibold">{label}</span>
    <span>{value || "Not Provided"}</span>
  </div>
);

export default ReviewItem
