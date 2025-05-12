import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ChevronDown, ChevronUp, Recycle, Shirt, Settings, DollarSign } from "lucide-react";

const FilterSection = ({ title, icon, isOpen, onToggle, children }) => {
  return (
    <div className="border-b border-gray-200">
      <div
        className="flex justify-between items-center py-3 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center">
          {icon}
          <span className="ml-2 font-medium">{title}</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </div>
      {isOpen && <div className="py-3">{children}</div>}
    </div>
  );
};

const AdvancedFilters = ({ requirements = {}, onRequirementsChange, onReset, onApply, showApplyButton = true }) => {
  const [sections, setSections] = useState({
    garmentPrinting: true,
    supplyChain: true,
    services: true,
    budget: true,
  });

  const toggleSection = (section) => {
    setSections({
      ...sections,
      [section]: !sections[section],
    });
  };

  const handleToggleSwitch = (field) => {
    onRequirementsChange({
      ...requirements,
      [field]: !requirements[field],
    });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    // Reset local filters
    onRequirementsChange({
      materialType: [],
      minimumSustainabilityScore: 0,
      maxDistance: 30,
      prioritizeLocalSupplyChain: true,
      services: [],
      budgetFriendly: false,
      premium: false
    });
  };

  const handleSliderChange = (field, value) => {
    onRequirementsChange({
      ...requirements,
      [field]: parseInt(value),
    });
  };

  const handleCheckboxChange = (field, value, checked) => {
    // Handle material type checkboxes
    if (field === "materialType") {
      const currentValues = requirements.materialType || [];
      const newValues = checked
        ? [...currentValues, value]
        : currentValues.filter((v) => v !== value);

      onRequirementsChange({
        ...requirements,
        materialType: newValues,
      });
      return;
    }

    // Handle services checkboxes
    if (field === "services") {
      const currentServices = requirements.services || [];
      const newServices = checked
        ? [...currentServices, value]
        : currentServices.filter((v) => v !== value);

      onRequirementsChange({
        ...requirements,
        services: newServices,
      });
      return;
    }

    // Handle simple boolean fields
    onRequirementsChange({
      ...requirements,
      [field]: checked,
    });
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Settings size={18} className="mr-2" />
            <h3 className="font-semibold text-lg">Advanced Filters</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            Reset
          </Button>
        </div>

        <FilterSection
          title="Garment Printing"
          icon={<Shirt size={18} />}
          isOpen={sections.garmentPrinting}
          onToggle={() => toggleSection("garmentPrinting")}
        >
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="garment-printing"
                className="mr-2 h-4 w-4"
                checked={requirements.services?.includes("garment printing")}
                onChange={(e) =>
                  handleCheckboxChange(
                    "services",
                    "garment printing",
                    e.target.checked
                  )
                }
              />
              <label htmlFor="garment-printing">Garment Printing Services</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="screen-printing"
                className="mr-2 h-4 w-4"
                checked={requirements.services?.includes("screen printing")}
                onChange={(e) =>
                  handleCheckboxChange(
                    "services",
                    "screen printing",
                    e.target.checked
                  )
                }
              />
              <label htmlFor="screen-printing">Screen Printing</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="dtg-printing"
                className="mr-2 h-4 w-4"
                checked={requirements.services?.includes("DTG printing")}
                onChange={(e) =>
                  handleCheckboxChange(
                    "services",
                    "DTG printing",
                    e.target.checked
                  )
                }
              />
              <label htmlFor="dtg-printing">DTG Printing</label>
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Supply Chain Preferences"
          icon={<Recycle size={18} />}
          isOpen={sections.supplyChain}
          onToggle={() => toggleSection("supplyChain")}
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label htmlFor="local-supply-chain">Local Supply Chain Priority</label>
              <div
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                  requirements.prioritizeLocalSupplyChain ? "bg-blue-600" : "bg-gray-200"
                }`}
                onClick={() => handleToggleSwitch("prioritizeLocalSupplyChain")}
              >
                <span
                  className={`inline-block h-5 w-5 rounded-full bg-white transition-transform ${
                    requirements.prioritizeLocalSupplyChain ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block mb-2">Material Type</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="recycled-materials"
                    className="mr-2 h-4 w-4"
                    checked={requirements.materialType?.includes("recycled")}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "materialType",
                        "recycled",
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor="recycled-materials">Recycled Materials</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="organic-materials"
                    className="mr-2 h-4 w-4"
                    checked={requirements.materialType?.includes("organic")}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "materialType",
                        "organic",
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor="organic-materials">Organic Materials</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fsc-certified"
                    className="mr-2 h-4 w-4"
                    checked={requirements.materialType?.includes("fsc")}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "materialType",
                        "fsc",
                        e.target.checked
                      )
                    }
                  />
                  <label htmlFor="fsc-certified">FSC Certified</label>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="sustainability-score">Minimum Sustainability Score</label>
                <span className="font-medium">
                  {requirements.minimumSustainabilityScore || 0}
                </span>
              </div>
              <input
                type="range"
                id="sustainability-score"
                min="0"
                max="100"
                value={requirements.minimumSustainabilityScore || 0}
                onChange={(e) =>
                  handleSliderChange("minimumSustainabilityScore", e.target.value)
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Any</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="max-distance">Max Distance for Suppliers</label>
                <span className="font-medium">
                  {requirements.maxDistance || 30} miles
                </span>
              </div>
              <input
                type="range"
                id="max-distance"
                min="5"
                max="50"
                value={requirements.maxDistance || 30}
                onChange={(e) => handleSliderChange("maxDistance", e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Local</span>
                <span>Regional</span>
              </div>
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Other Services"
          icon={<Settings size={18} />}
          isOpen={sections.services}
          onToggle={() => toggleSection("services")}
        >
          <div className="space-y-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="large-format"
                className="mr-2 h-4 w-4"
                checked={requirements.services?.includes("large format")}
                onChange={(e) =>
                  handleCheckboxChange(
                    "services",
                    "large format",
                    e.target.checked
                  )
                }
              />
              <label htmlFor="large-format">Large Format Printing</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="digital-printing"
                className="mr-2 h-4 w-4"
                checked={requirements.services?.includes("digital printing")}
                onChange={(e) =>
                  handleCheckboxChange(
                    "services",
                    "digital printing",
                    e.target.checked
                  )
                }
              />
              <label htmlFor="digital-printing">Digital Printing</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="finishing"
                className="mr-2 h-4 w-4"
                checked={requirements.services?.includes("finishing")}
                onChange={(e) =>
                  handleCheckboxChange(
                    "services",
                    "finishing",
                    e.target.checked
                  )
                }
              />
              <label htmlFor="finishing">Finishing Services</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="specialty-printing"
                className="mr-2 h-4 w-4"
                checked={requirements.services?.includes("specialty printing")}
                onChange={(e) =>
                  handleCheckboxChange(
                    "services",
                    "specialty printing",
                    e.target.checked
                  )
                }
              />
              <label htmlFor="specialty-printing">Specialty Printing</label>
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Budget"
          icon={<DollarSign size={18} />}
          isOpen={sections.budget}
          onToggle={() => toggleSection("budget")}
        >
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="budget-friendly"
                className="mr-2 h-4 w-4"
                checked={requirements.budgetFriendly}
                onChange={(e) =>
                  handleCheckboxChange(
                    "budgetFriendly",
                    null,
                    e.target.checked
                  )
                }
              />
              <label htmlFor="budget-friendly">Budget-Friendly Options</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="premium"
                className="mr-2 h-4 w-4"
                checked={requirements.premium}
                onChange={(e) =>
                  handleCheckboxChange(
                    "premium",
                    null,
                    e.target.checked
                  )
                }
              />
              <label htmlFor="premium">Premium Quality</label>
            </div>
          </div>
        </FilterSection>

        <div className="mt-4">
          {showApplyButton && (
            <Button className="w-full bg-primary text-white hover:bg-primary/90" onClick={onApply}>
              Apply Filters
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedFilters;
