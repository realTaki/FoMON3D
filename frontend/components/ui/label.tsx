import * as React from "react";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className = "", ...props }, ref) => (
  <label
    ref={ref}
    className={"text-sm font-medium text-slate-400 " + className}
    {...props}
  />
));
Label.displayName = "Label";
export { Label };
