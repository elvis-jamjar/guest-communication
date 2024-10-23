import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from 'react';

interface ScreenProps {
    children: React.ReactNode
}

// const MobileScreen: React.FC<ScreenProps> = ({ children }) => (
//   <div className="w-72 h-[600px] bg-white rounded-[30px] shadow-xl overflow-hidden border-8 border-gray-800 relative">
//     <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 flex items-center justify-center">
//       <div className="w-16 h-2 bg-gray-600 rounded-full"></div>
//     </div>
//     <div className="h-full overflow-auto">
//       {children}
//     </div>
//   </div>
// )

// const TabletScreen: React.FC<ScreenProps> = ({ children }) => (
//   <div className="w-[900px] h-[600px] bg-white rounded-[20px] shadow-xl overflow-hidden border-8 border-gray-800 relative">
//     <div className="absolute top-0 inset-x-0 h-4 bg-gray-800"></div>
//     <div className="h-full overflow-auto">
//       {children}
//     </div>
//   </div>
// )

const DesktopScreen: React.FC<ScreenProps> = ({ children }) => (
    <div className="w-[1024px] max-h-[80dvh] bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 flex flex-col">
        <div className="h-8 bg-gray-100 flex items-center px-4 space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <div className="flex-1 w-full flex justify-center font-bold">Preview</div>
        </div>
        <div className="flex-1 overflow-auto p-5">
            {children}
        </div>
    </div>
)

interface ScreenSimulatorProps {
    mobileContent?: React.ReactNode
    tabletContent?: React.ReactNode
    desktopContent: React.ReactNode
    desktopSecondContent?: React.ReactNode
}

export function ScreenSimulator({ desktopContent, desktopSecondContent }: ScreenSimulatorProps) {
    const [activeTab, setActiveTab] = useState("desktop")

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-1">
                    {/* <TabsTrigger value="mobile">Mobile</TabsTrigger> */}
                    <TabsTrigger value="desktop">Preview</TabsTrigger>
                    <TabsTrigger value="tablet">Speakers</TabsTrigger>
                </TabsList>
                <div className="flex justify-center items-center bg-gray-50 rounded-lg p-2">
                    {/* <TabsContent value="mobile" className="mt-0">
            <MobileScreen>{mobileContent}</MobileScreen>
          </TabsContent> */}
                    <TabsContent value="tablet" className="mt-0">
                        {/* <TabletScreen>{tabletContent}</TabletScreen> */}
                        <DesktopScreen>{desktopSecondContent}</DesktopScreen>
                    </TabsContent>
                    <TabsContent value="desktop" className="mt-0">
                        <DesktopScreen>{desktopContent}</DesktopScreen>
                    </TabsContent>
                </div>
            </Tabs>
            {/* <div className="mt-8 text-center">
        <Button onClick={() => setActiveTab(prev => {
          const screens = ['mobile', 'tablet', 'desktop']
          const currentIndex = screens.indexOf(prev)
          return screens[(currentIndex + 1) % screens.length]
        })}>
          Switch to Next Screen
        </Button>
      </div> */}
        </div>
    )
}