import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Users, Star, Monitor, MapPin, Trees, Leaf, Loader2, Filter, ChevronDown, X, GraduationCap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Course } from "@shared/schema";

function getLevelColor(level: string) {
  switch (level) {
    case "Beginner":
      return "bg-green-500";
    case "Intermediate":
      return "bg-emerald-500";
    case "Advanced":
      return "bg-bitcoin-orange";
    case "Expert":
      return "bg-purple-500";
    default:
      return "bg-gray-500";
  }
}



const CourseCard = ({ course, isInPerson = false }: { course: Course, isInPerson?: boolean }) => {
  const handleEnrollCourse = (courseId: number) => {
    console.log(`Enrolling in course ${courseId}...`);
  };

  const isNatureReserve = course.isNatureReserve;
  const levelColor = getLevelColor(course.level);

  return (
    <Card className={`hover:shadow-lg transition-shadow ${isNatureReserve ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Badge className={`${levelColor} text-white`}>
              {course.level}
            </Badge>
            {isNatureReserve && (
              <Badge variant="outline" className="border-green-500 text-green-700 bg-green-50">
                <Trees className="w-3 h-3 mr-1" />
                Nature Reserve
              </Badge>
            )}
          </div>
          <span className="text-gray-500 text-sm">{course.duration}</span>
        </div>
        <h3 className="text-xl font-semibold text-charcoal mb-2">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        
        {isInPerson && (
          <div className="flex items-center mb-3">
            {isNatureReserve ? (
              <Trees className="w-4 h-4 text-green-600 mr-2" />
            ) : (
              <MapPin className="w-4 h-4 text-bitcoin-orange mr-2" />
            )}
            <span className={`text-sm ${isNatureReserve ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
              {course.location}
            </span>
          </div>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center">
            {!isInPerson ? (
              <Monitor className="w-4 h-4 text-bitcoin-orange mr-2" />
            ) : isNatureReserve ? (
              <Leaf className="w-4 h-4 text-green-600 mr-2" />
            ) : (
              <MapPin className="w-4 h-4 text-bitcoin-orange mr-2" />
            )}
            <span className="text-sm text-gray-600">{course.deliveryStyle}</span>
          </div>
          
          {course.facilities && course.facilities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {course.facilities.slice(0, 2).map((facility, index) => (
                <Badge key={index} variant="outline" className="text-xs text-gray-600">
                  {facility}
                </Badge>
              ))}
              {course.facilities.length > 2 && (
                <Badge variant="outline" className="text-xs text-gray-600">
                  +{course.facilities.length - 2} more
                </Badge>
              )}
            </div>
          )}
          
          {course.scholarshipSupport && (
            <div className="flex items-center">
              <GraduationCap className="w-4 h-4 text-bitcoin-orange mr-2" />
              <span className="text-sm text-bitcoin-orange font-medium">Scholarship Available</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Users className="w-4 h-4 text-bitcoin-orange mr-2" />
            <span className="text-sm text-gray-600">{course.enrolled} enrolled</span>
          </div>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="text-sm text-gray-600">{course.rating}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Link href={`/courses/${course.id}`}>
            <Button 
              variant="outline"
              className={`w-full ${isNatureReserve ? 'border-green-600 text-green-700 hover:bg-green-50' : 'border-bitcoin-orange text-bitcoin-orange hover:bg-orange-50'}`}
            >
              View Details
            </Button>
          </Link>
          <Button 
            onClick={() => handleEnrollCourse(course.id)}
            className={`w-full ${isNatureReserve ? 'bg-green-600 hover:bg-green-700' : 'bg-bitcoin-orange hover:bg-orange-600'}`}
          >
            Enroll Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Filter state interface
interface FilterState {
  deliveryMethod: string[];
  priceRange: [number, number];
  location: string[];
  facilities: string[];
  scholarshipSupport: boolean | null;
  deliveryStyle: string[];
  level: string[];
}

const initialFilterState: FilterState = {
  deliveryMethod: [],
  priceRange: [0, 2000],
  location: [],
  facilities: [],
  scholarshipSupport: null,
  deliveryStyle: [],
  level: [],
};

// Filter component
function FilterPanel({ filters, onFilterChange, courses }: { 
  filters: FilterState; 
  onFilterChange: (filters: FilterState) => void;
  courses: Course[] | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get unique values for filter options
  const uniqueLocations = Array.from(new Set(courses?.map(c => c.location) || []));
  const uniqueFacilities = Array.from(new Set(courses?.flatMap(c => c.facilities || []) || []));
  const uniqueDeliveryStyles = Array.from(new Set(courses?.map(c => c.deliveryStyle) || []));
  const uniqueLevels = Array.from(new Set(courses?.map(c => c.level) || []));

  const handleCheckboxChange = (
    filterKey: keyof FilterState,
    value: string,
    checked: boolean
  ) => {
    const currentValues = filters[filterKey] as string[];
    const newValues = checked
      ? [...currentValues, value]
      : currentValues.filter(v => v !== value);
    
    onFilterChange({
      ...filters,
      [filterKey]: newValues,
    });
  };

  const clearAllFilters = () => {
    onFilterChange(initialFilterState);
  };

  const hasActiveFilters = 
    filters.deliveryMethod.length > 0 ||
    filters.location.length > 0 ||
    filters.facilities.length > 0 ||
    filters.deliveryStyle.length > 0 ||
    filters.level.length > 0 ||
    filters.scholarshipSupport !== null ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 2000;

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-bitcoin-orange" />
            <span className="text-lg font-semibold text-charcoal">Filter Courses</span>
            {hasActiveFilters && (
              <Badge variant="outline" className="bg-bitcoin-orange text-white">
                Active Filters
              </Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  clearAllFilters();
                }}
                className="text-gray-500 hover:text-bitcoin-orange cursor-pointer flex items-center text-sm px-2 py-1 rounded hover:bg-gray-50"
              >
                <X className="w-4 h-4 mr-1" />
                Clear All
              </div>
            )}
            <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Delivery Method Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-charcoal">Delivery Method</h4>
              <div className="space-y-2">
                {['online', 'in-person'].map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={`delivery-${method}`}
                      checked={filters.deliveryMethod.includes(method)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('deliveryMethod', method, !!checked)
                      }
                    />
                    <label
                      htmlFor={`delivery-${method}`}
                      className="text-sm text-gray-600 capitalize cursor-pointer"
                    >
                      {method === 'online' ? 'Online' : 'In-Person'}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-charcoal">Price Range</h4>
              <div className="space-y-4">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    onFilterChange({ ...filters, priceRange: value as [number, number] })
                  }
                  max={2000}
                  min={0}
                  step={50}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Location Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-charcoal">Location</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueLocations.map((location) => (
                  <div key={location} className="flex items-center space-x-2">
                    <Checkbox
                      id={`location-${location}`}
                      checked={filters.location.includes(location)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('location', location, !!checked)
                      }
                    />
                    <label
                      htmlFor={`location-${location}`}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {location}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Level Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-charcoal">Course Level</h4>
              <div className="space-y-2">
                {uniqueLevels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      id={`level-${level}`}
                      checked={filters.level.includes(level)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('level', level, !!checked)
                      }
                    />
                    <label
                      htmlFor={`level-${level}`}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {level}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Facilities Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-charcoal">Facilities</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueFacilities.map((facility) => (
                  <div key={facility} className="flex items-center space-x-2">
                    <Checkbox
                      id={`facility-${facility}`}
                      checked={filters.facilities.includes(facility)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('facilities', facility, !!checked)
                      }
                    />
                    <label
                      htmlFor={`facility-${facility}`}
                      className="text-sm text-gray-600 cursor-pointer"
                    >
                      {facility}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Style Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-charcoal">Delivery Style</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {uniqueDeliveryStyles.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={`style-${style}`}
                      checked={filters.deliveryStyle.includes(style)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange('deliveryStyle', style, !!checked)
                      }
                    />
                    <label
                      htmlFor={`style-${style}`}
                      className="text-sm text-gray-600 cursor-pointer text-wrap"
                    >
                      {style}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Scholarship Support Filter */}
            <div className="space-y-3">
              <h4 className="font-medium text-charcoal">Scholarship Support</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scholarship-yes"
                    checked={filters.scholarshipSupport === true}
                    onCheckedChange={(checked) =>
                      onFilterChange({
                        ...filters,
                        scholarshipSupport: checked ? true : null,
                      })
                    }
                  />
                  <label htmlFor="scholarship-yes" className="text-sm text-gray-600 cursor-pointer">
                    <GraduationCap className="w-4 h-4 inline mr-1" />
                    Available
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="scholarship-no"
                    checked={filters.scholarshipSupport === false}
                    onCheckedChange={(checked) =>
                      onFilterChange({
                        ...filters,
                        scholarshipSupport: checked ? false : null,
                      })
                    }
                  />
                  <label htmlFor="scholarship-no" className="text-sm text-gray-600 cursor-pointer">
                    Not Required
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}

export default function CourseOfferings() {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  
  const { data: courses, isLoading, error } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  // Filter courses based on current filter state
  const filteredCourses = courses?.filter((course) => {
    // Delivery method filter
    if (filters.deliveryMethod.length > 0 && !filters.deliveryMethod.includes(course.deliveryMethod)) {
      return false;
    }

    // Price range filter
    const price = parseFloat(course.price);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }

    // Location filter
    if (filters.location.length > 0 && !filters.location.includes(course.location)) {
      return false;
    }

    // Level filter
    if (filters.level.length > 0 && !filters.level.includes(course.level)) {
      return false;
    }

    // Facilities filter
    if (filters.facilities.length > 0) {
      const courseFacilities = course.facilities || [];
      if (!filters.facilities.some(facility => courseFacilities.includes(facility))) {
        return false;
      }
    }

    // Delivery style filter
    if (filters.deliveryStyle.length > 0 && !filters.deliveryStyle.includes(course.deliveryStyle)) {
      return false;
    }

    // Scholarship support filter
    if (filters.scholarshipSupport !== null && course.scholarshipSupport !== filters.scholarshipSupport) {
      return false;
    }

    return true;
  }) || [];

  if (isLoading) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-bitcoin-orange" />
            <span className="ml-2 text-lg text-gray-600">Loading courses...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Courses</h2>
            <p className="text-gray-600">Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  const onlineCourses = filteredCourses.filter(course => course.deliveryMethod === "online");
  const inPersonCourses = filteredCourses.filter(course => course.deliveryMethod === "in-person");

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-charcoal mb-4">Course Offerings</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Learn from leading researchers and industry experts in our comprehensive Web3 education programs.
          </p>
        </div>

        {/* Filter Panel */}
        <FilterPanel 
          filters={filters} 
          onFilterChange={setFilters}
          courses={courses}
        />

        {/* Results Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="text-gray-600">
            Showing {filteredCourses.length} of {courses?.length || 0} courses
          </div>
          {(filters.deliveryMethod.length > 0 || filters.location.length > 0 || filters.facilities.length > 0 || 
            filters.deliveryStyle.length > 0 || filters.level.length > 0 || filters.scholarshipSupport !== null ||
            filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setFilters(initialFilterState)}
              className="text-bitcoin-orange border-bitcoin-orange hover:bg-orange-50"
            >
              <X className="w-4 h-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        <Tabs defaultValue="online" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-[400px] grid-cols-2">
              <TabsTrigger value="online" className="flex items-center space-x-2">
                <Monitor className="w-4 h-4" />
                <span>Online Courses ({onlineCourses.length})</span>
              </TabsTrigger>
              <TabsTrigger value="in-person" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>In-Person Courses ({inPersonCourses.length})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="online">
            {onlineCourses.length === 0 ? (
              <div className="text-center py-12">
                <Monitor className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No online courses found</h3>
                <p className="text-gray-400">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {onlineCourses.map((course) => (
                  <CourseCard key={course.id} course={course} isInPerson={false} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-person">
            {inPersonCourses.length === 0 ? (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-500 mb-2">No in-person courses found</h3>
                <p className="text-gray-400">Try adjusting your filters to see more results.</p>
              </div>
            ) : (
              <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
                {inPersonCourses.map((course) => (
                  <CourseCard key={course.id} course={course} isInPerson={true} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
