"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Settings } from 'lucide-react'
import { useForm } from "react-hook-form"

const PDFAudioSettings = ({ 
  settings, 
  onSettingsChange, 
  onSubmit 
}) => {
  const [open, setOpen] = useState(false)
  
  const form = useForm({
    defaultValues: settings
  })

  const handleSubmit = (values) => {
    onSettingsChange(values) // Update settings locally
    setOpen(false)
    onSubmit(values) // Submit with new settings
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 flex-shrink-0 text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Audio Settings</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 py-2">
            <FormField
              control={form.control}
              name="voice"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Voice</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Angelo">Angelo</SelectItem>
                      <SelectItem value="Deedee">Deedee</SelectItem>
                      <SelectItem value="Jennifer">Jennifer</SelectItem>
                      <SelectItem value="Briggs">Briggs</SelectItem>
                      <SelectItem value="Samara">Samara</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the voice for text-to-speech
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="speed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Speed</FormLabel>
                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Slow</span>
                      <span className="text-sm font-medium">{field.value}x</span>
                      <span className="text-xs text-muted-foreground">Fast</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0.1}
                        max={4.9}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Adjust the playback speed
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="temperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperature</FormLabel>
                  <div className="flex flex-col space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">Consistent</span>
                      <span className="text-sm font-medium">{field.value}</span>
                      <span className="text-xs text-muted-foreground">Variable</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={1}
                        step={0.1}
                        value={[field.value]}
                        onValueChange={(value) => field.onChange(value[0])}
                      />
                    </FormControl>
                  </div>
                  <FormDescription>
                    Control the randomness of the voice
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end">
              <Button type="submit">
                Apply Settings
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default PDFAudioSettings