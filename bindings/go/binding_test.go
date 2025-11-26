package tree_sitter_csound_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_csound "github.com/tree-sitter/tree-sitter-csound/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_csound.Language())
	if language == nil {
		t.Errorf("Error loading Tree-sitter Csound grammar")
	}
}
