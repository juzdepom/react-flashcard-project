# ruby sort.rb paste-here.txt > masterlist.txt 

if ARGV.size > 0
  data = File.read(ARGV[0])
else
  data = STDIN.read
end

lines = data.split(/[\r\n]+/)

lines.each do |line|

  # use regex to take off all the digits with a period and space after
  line.gsub!(/(\d+|(\. ))/,"")
  line.downcase!
end

lines.sort!
puts lines

#in order for this to work in Apple Notes we need no rating

# i = 1
# lines.each do |line|
    # puts line
#     puts i.to_s + ". " + line
#     i += 1
# end


 
