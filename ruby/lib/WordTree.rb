
class WordTree
  attr_accessor :word, :children

  def initialize
    @word = nil
    @children = {}
  end

  # insert a word into the tree, if and branch off as we need to
  def insert(word)
    node = self

    word.each_char do |char|

      unless node.children.has_key?(char)
        node.children[char] = WordTree.new
      end

      node = node.children[char]
    end

    node.instance_variable_set(:@word, word)

    self
  end

  # get the number of words in this tree all the way down to the roots
  def wordCount
    count = 0

    if (@word.to_s != '')
      count += 1
    end

    if @children.size
      @children.each do |key, val|
        count += val.wordCount
      end
    end

    count
  end

  # get the number of nodes in this tree all the way down to the roots
  def nodeCount
    count = 1

    if @children.size
      @children.each do |key, val|
        count += val.nodeCount
      end
    end

    count
  end
end
