import React, { Component, type ComponentType } from 'react';
import { LocalizeContext, type LocalizeContextProps, type ElementConfig } from './LocalizeContext';

export function withLocalize<Props, Component: ComponentType<LocalizeContextProps>>(WrappedComponent: ComponentType<Props>): ElementConfig<Component> {

  const LocalizedComponent = (props: Props) => {
    return (
      <LocalizeContext.Consumer>
         {context => 
           <WrappedComponent 
            { ...context }  
            { ...props }
           />
         }
      </LocalizeContext.Consumer>
    );
  }

  return LocalizedComponent;
};
