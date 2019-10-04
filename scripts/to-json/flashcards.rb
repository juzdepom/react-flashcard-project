# ruby flashcards.rb paste-here.txt > new.txt 

require 'date'

if ARGV.size > 0
  data = File.read(ARGV[0])
else
  data = STDIN.read
end

lines = data.split(/[\r\n]+/)


# puts "["

lines.each do |line|

  # use regex to take off all the digits with a period and space after
  line.gsub!(/(\d+|(\. ))/,"")
  line.downcase!

  # don't need this anymore but will keep on hand for now
  # line.sub!('-', '==')

  parts = line.split('==')
  textOne = parts[0].strip
  
  parts = parts[1].split(">")
  textTwo = parts[0].strip
  textThree = parts[1].strip

  # puts textOne
  # puts textTwo
  # puts textThree

  date = Date.today.to_s

  # puts "{\"" + part0 + "\":\"" + part1 + "\"},"

  puts "{"
  puts "\"textOne\":\"" + textOne + "\","
  puts "\"textTwo\":\"" + textTwo + "\","
  puts "\"textThree\":\"" + textThree + "\","
  puts "\"rating\":1,"
  # puts "\"exposure\":0,"
  puts "\"dateCreated\":\"" + date + "\","
  puts "\"lastReviewed\":[]"
  puts "},"
   
end

# puts "]"

 
