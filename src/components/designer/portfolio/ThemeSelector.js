import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Label } from '../../../components/ui/label';
import { Grid2X2, Rows, Layout, Palette, Save } from 'lucide-react';

const ThemeSelector = ({ themeSettings, onChange, onSave, viewOnly = false }) => {
  const [activeTab, setActiveTab] = useState('layout');

  // Default theme settings
  const defaultSettings = {
    primaryColor: '#3a6ea5',
    secondaryColor: '#ff6b6b',
    fontFamily: 'Segoe UI',
    layout: 'grid'
  };

  // Combine default settings with provided settings
  const settings = { ...defaultSettings, ...themeSettings };

  // Available color themes
  const colorThemes = [
    { name: 'Blue & Coral', primary: '#3a6ea5', secondary: '#ff6b6b' },
    { name: 'Forest & Gold', primary: '#2c7a51', secondary: '#e6b54c' },
    { name: 'Purple & Teal', primary: '#7e57c2', secondary: '#26a69a' },
    { name: 'Charcoal & Red', primary: '#37474f', secondary: '#e57373' },
    { name: 'Teal & Orange', primary: '#00897b', secondary: '#ff7043' }
  ];

  // Available font options
  const fontOptions = [
    { value: 'Segoe UI, sans-serif', label: 'Segoe UI' },
    { value: 'Roboto, sans-serif', label: 'Roboto' },
    { value: 'Poppins, sans-serif', label: 'Poppins' },
    { value: 'Playfair Display, serif', label: 'Playfair Display' },
    { value: 'Montserrat, sans-serif', label: 'Montserrat' }
  ];

  // Available layout options
  const layoutOptions = [
    { value: 'grid', label: 'Grid', icon: <Grid2X2 className="h-5 w-5" /> },
    { value: 'masonry', label: 'Masonry', icon: <Layout className="h-5 w-5" /> },
    { value: 'rows', label: 'Rows', icon: <Rows className="h-5 w-5" /> }
  ];

  // Handle color theme change
  const handleColorThemeChange = (theme) => {
    onChange({
      primaryColor: theme.primary,
      secondaryColor: theme.secondary
    });
  };

  // Handle font change
  const handleFontChange = (fontFamily) => {
    onChange({ fontFamily });
  };

  // Handle layout change
  const handleLayoutChange = (layout) => {
    onChange({ layout });
  };

  // If in view-only mode, render a simplified version
  if (viewOnly) {
    return (
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Theme</h3>
        <div className="flex space-x-2">
          <div 
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: settings.primaryColor }}
            title="Primary Color"
          ></div>
          <div 
            className="h-6 w-6 rounded-full border"
            style={{ backgroundColor: settings.secondaryColor }}
            title="Secondary Color"
          ></div>
          <div className="text-sm ml-2">
            {settings.layout.charAt(0).toUpperCase() + settings.layout.slice(1)} layout
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Theme Settings</h3>
        {onSave && (
          <Button onClick={onSave} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Apply Changes
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="layout" className="flex items-center">
            <Layout className="h-4 w-4 mr-2" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="colors" className="flex items-center">
            <Palette className="h-4 w-4 mr-2" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center">
            <span className="mr-2 font-bold">T</span>
            Typography
          </TabsTrigger>
        </TabsList>

        {/* Layout Options */}
        <TabsContent value="layout" className="space-y-4">
          <RadioGroup 
            defaultValue={settings.layout} 
            value={settings.layout}
            onValueChange={handleLayoutChange}
            className="grid grid-cols-3 gap-4"
          >
            {layoutOptions.map((option) => (
              <div key={option.value}>
                <RadioGroupItem
                  value={option.value}
                  id={`layout-${option.value}`}
                  className="sr-only"
                />
                <Label
                  htmlFor={`layout-${option.value}`}
                  className={`flex flex-col items-center justify-center border-2 rounded-lg p-4 cursor-pointer hover:bg-gray-50
                    ${settings.layout === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  {option.icon}
                  <span className="mt-2">{option.label}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>

          <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
            <p>
              <strong>Grid:</strong> Displays designs in a uniform grid, ideal for a clean, organized look.
            </p>
            <p>
              <strong>Masonry:</strong> Creates a dynamic layout with varying heights, perfect for diverse content.
            </p>
            <p>
              <strong>Rows:</strong> Shows designs in horizontal rows, great for showcasing process or timeline.
            </p>
          </div>
        </TabsContent>

        {/* Color Options */}
        <TabsContent value="colors" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {colorThemes.map((theme, index) => (
              <div 
                key={index}
                className={`p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50
                  ${settings.primaryColor === theme.primary && settings.secondaryColor === theme.secondary 
                    ? 'border-blue-500' : 'border-gray-200'}`}
                onClick={() => handleColorThemeChange(theme)}
              >
                <div className="font-medium mb-2">{theme.name}</div>
                <div className="flex space-x-2">
                  <div 
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: theme.primary }}
                    title="Primary Color"
                  ></div>
                  <div 
                    className="h-8 w-8 rounded-full"
                    style={{ backgroundColor: theme.secondary }}
                    title="Secondary Color"
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between border p-4 rounded-lg bg-white">
            <div>
              <p className="font-medium">Current Selection</p>
              <div className="flex space-x-2 mt-2">
                <div 
                  className="h-6 w-6 rounded-full border"
                  style={{ backgroundColor: settings.primaryColor }}
                  title="Primary Color"
                ></div>
                <div 
                  className="h-6 w-6 rounded-full border"
                  style={{ backgroundColor: settings.secondaryColor }}
                  title="Secondary Color"
                ></div>
              </div>
            </div>
            
            <div>
              <p className="text-xs text-gray-500">Primary: {settings.primaryColor}</p>
              <p className="text-xs text-gray-500">Secondary: {settings.secondaryColor}</p>
            </div>
          </div>
        </TabsContent>

        {/* Typography Options */}
        <TabsContent value="typography" className="space-y-4">
          <RadioGroup 
            defaultValue={settings.fontFamily} 
            value={settings.fontFamily}
            onValueChange={handleFontChange}
            className="space-y-3"
          >
            {fontOptions.map((font) => (
              <div key={font.value} className="flex items-center space-x-2">
                <RadioGroupItem value={font.value} id={`font-${font.label}`} />
                <Label 
                  htmlFor={`font-${font.label}`}
                  className="flex-1 cursor-pointer"
                >
                  <div className="flex justify-between items-center p-3 border rounded hover:bg-gray-50">
                    <span style={{ fontFamily: font.value }}>{font.label}</span>
                    <span 
                      style={{ fontFamily: font.value }}
                      className="text-gray-500 text-sm"
                    >
                      The quick brown fox jumps over the lazy dog
                    </span>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </TabsContent>
      </Tabs>

      <div className="p-4 border rounded-lg mt-4 bg-gray-50">
        <h4 className="font-medium mb-2">Theme Preview</h4>
        <div className="p-4 bg-white rounded border" style={{ fontFamily: settings.fontFamily }}>
          <div 
            className="h-12 rounded-md mb-4"
            style={{ backgroundColor: settings.primaryColor }}
          ></div>
          <div className="flex space-x-4 mb-4">
            <div className="h-24 w-24 bg-gray-200 rounded"></div>
            <div>
              <div 
                className="h-6 w-32 rounded mb-2"
                style={{ backgroundColor: settings.secondaryColor }}
              ></div>
              <div className="h-4 w-48 bg-gray-100 rounded mb-1"></div>
              <div className="h-4 w-40 bg-gray-100 rounded"></div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="h-12 bg-gray-100 rounded"></div>
            <div className="h-12 bg-gray-100 rounded"></div>
            <div className="h-12 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;