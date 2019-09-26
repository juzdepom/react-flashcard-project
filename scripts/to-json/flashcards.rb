#!/usr/bin/env ruby

# type 
# ruby flashcards.rb paste-here.txt 
# into terminal to see text output in terminal

# type 
# ruby flashcards.rb paste-here.txt > new.txt 
# into terminal to 'put' into file

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
  part0 = parts[0].strip
  part1 = parts[1].strip
  date = Date.today.to_s

  # puts "{\"" + part0 + "\":\"" + part1 + "\"},"
  puts "{"
  puts "\"frontText\":\"" + part0 + "\","
  puts "\"backText\":\"" + part1 + "\","
  puts "\"rating\":1,"
  puts "\"exposure\":0,"
  puts "\"dateCreated\":\"" + date + "\","
  puts "\"lastReviewed\":\"\""
  puts "},"
   
end

# puts "]"

 
