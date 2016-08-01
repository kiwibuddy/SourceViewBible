#!/usr/bin/env ruby

# .highlightFamily.highlightEconomics.highlightGovernment.highlightReligion.highlightEducation.highlightCommunication.highlightCelebration {
#   background: linear-gradient(180deg, #FFD8D6, #FFD8D6 14.28%, #FFEACC 14.28%, #FFEACC 28.56%, #FFF5CD 28.56%, #FFF5CD 42.84%, #E8F4CE 42.84%, #E8F4CE 57.12%, #D4F1F7 57.12%, #D4F1F7 71.4%, #DEDEF7 71.4%, #DEDEF7 85.68%, #F9DEEF 85.68%, #F9DEEF);
# }

require 'pp'

sphereColors = {
  "Family" => "#FFD8D6",
  "Economics" => "#FFEACC",
  "Government" => "#FFF5CD",
  "Religion" => "#E8F4CE",
  "Education" => "#D4F1F7",
  "Communication" => "#DEDEF7",
  "Celebration" => "#F9DEEF"
}

sphereColors = {
  "Family" => "${Colors.spheres.family.highlightTint}",
  "Economics" => "${Colors.spheres.economics.highlightTint}",
  "Government" => "${Colors.spheres.government.highlightTint}",
  "Religion" => "${Colors.spheres.religion.highlightTint}",
  "Education" => "${Colors.spheres.education.highlightTint}",
  "Communication" => "${Colors.spheres.communication.highlightTint}",
  "Celebration" => "${Colors.spheres.celebration.highlightTint}"
}


spheres = ["Family", "Economics", "Government", "Religion", "Education", "Communication", "Celebration"]
sphere_count = spheres.count

highlights = {}

(0..sphere_count).each do |i|
  for combination in spheres.combination(i)
    highlight_key = combination.map{|sphere| "highlight#{sphere}"}.join(".")
    highlight_count = combination.length

    percent = (100.0/combination.length.to_f)
    highlight = combination.map.with_index do |sphere, index|
      beginPercent = (index * percent).round(3)
      endPercent = (beginPercent + percent).round(3)
      if index == 0
        "#{sphereColors[sphere]}, #{sphereColors[sphere]} #{endPercent}%"
      elsif index == (highlight_count - 1)
        "#{sphereColors[sphere]} #{beginPercent}%, #{sphereColors[sphere]}"
      else
        "#{sphereColors[sphere]} #{beginPercent}%, #{sphereColors[sphere]} #{endPercent}%"
      end
    end.join(", ")
    highlights[highlight_key] = "background: linear-gradient(180deg, #{highlight});" if highlight.strip.length > 0
  end
end



highlights.each do |key, highlight|
  STDOUT.puts "#{key} { #{highlight} }"
end

STDERR.puts "Count: #{highlights.length}"
