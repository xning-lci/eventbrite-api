'use client'
import Script from "next/script";
import React, { useEffect } from 'react';

export type EventBriteProps = {
  eventId: string;
};

export const EventBrite = ({ eventId }: EventBriteProps) => {

  return (
    <>
      <div id={`eventbrite-widget-container-${eventId}`} style={{width: '100%', height: '500px'}}></div>

      {/* 加载 Eventbrite 的 JS 脚本 */}
      <Script
        src="https://www.eventbrite.com/static/widgets/eb_widgets.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Eventbrite Widget Script Loaded");
          if (window?.EBWidgets) {
            window?.EBWidgets.createWidget({
              widgetType: 'checkout',
              eventId: eventId,
              iframeContainerId: `eventbrite-widget-container-${eventId}`,

              onOrderComplete: () => console.log('Order complete!'),
            });
          }
        }}
      />
    </>
  );
};
