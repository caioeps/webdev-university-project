require 'pathname'

# Turn this into a gem later.
module Framework
end

puts 'Loading Framework files...'
Dir.glob(Pathname.new(File.expand_path(__dir__)) + 'framework/**/*.rb') do |filename|
  puts "  Loading #{filename}"
  require filename
end
puts 'Done.'
