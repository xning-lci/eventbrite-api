'use client';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';

export type EventBriteProps = {
  eventId: string;
};

export type OrderDetails = {
  name: string;
  first_name: string;
  last_name: string;
  status: string;
  event_id: string;
  email: string;
  costs: {
    base_price: {
      display: string;
      currency: string;
    };
  }
  resource_uri: string;
  id: string;
}
export const EventBrite = ({ eventId }: EventBriteProps) => {
  const [scriptReady, setScriptReady] = useState(false);
  const [orderId, setOrderId] = useState<string | undefined>("12013939213");
  const [orderDetails, setOrderDetails] = useState<OrderDetails>();
  useEffect(() => {
    // @ts-expect-error script variable
    if (scriptReady && typeof window !== 'undefined' && window?.EBWidgets) {
      console.log('window.top === window.self', window.top === window.self)
      console.log('Initializing Eventbrite Widget');
      // @ts-expect-error script variable
      window?.EBWidgets.createWidget({
        widgetType: 'checkout',
        eventId: eventId,
        iframeContainerId: `eventbrite-widget-container-${eventId}`,
        onOrderComplete: (e: {orderId: string}) => {
          console.log('Order complete!', e);
            setOrderId(e.orderId);
        }
      });
    }
  }, [eventId, scriptReady]);

  const getOrderDetail = async (orderId: string) => {
    const response = await fetch('/api/event-brite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    });
    if (response.ok) {
      const data = await response.json();
      console.log('Order Detail:', data);
      setOrderDetails(data)
    } else {
      console.error('Failed to fetch order detail:', response);
    }
  }

  useEffect(() => {
    if(orderId){
      getOrderDetail(orderId)
    }
  }, [orderId]);
  return (
    <>
      <div id={`eventbrite-widget-container-${eventId}`} style={{ width: '100%', height: '800px' }}></div>

      <Script
        src="https://www.eventbrite.com/static/widgets/eb_widgets.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log('Eventbrite Widget Script Loaded');
          setScriptReady(true)
        }}
      />

      <div>OrderId: {orderId}</div>
      <div>orderDetails: </div>
      <div>Name:  {orderDetails?.name}</div>
      <div>Email:  {orderDetails?.email}</div>
    </>
  );
};
