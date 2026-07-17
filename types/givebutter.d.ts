import "react";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      /** Givebutter embed web component, upgraded by the widgets.givebutter.com loader. */
      "givebutter-widget": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        id: string;
        account: string;
      };
    }
  }
}
