var unproject = require('./')
var test = require('tape')
var Fuzz = require('test-fuzzy-array')

var mat4 = require('gl-mat4')
var vec3 = require('gl-vec3')

test('unproject 3D into 2D space', function(t) {
  var epsilon = 0.001
  var almostEqual = Fuzz(t, epsilon)
  var viewport = [0, 0, 128, 256]

  // simulate a camera (projection & view)
  var proj = mat4.create()
  var view = mat4.create()
  var position = [0, 0, -3]
  var direction = [0, 0, -1]
  var up = [0, 1, 0]
  var center = [0, 0, 0]

  mat4.perspective(proj, Math.PI / 4, viewport[2] / viewport[3], epsilon, 2)

  // build view matrix
  vec3.add(center, position, direction)
  mat4.lookAt(view, position, center, up)

  var combined = mat4.multiply([], proj, view)
  var invProj = mat4.invert([], combined)

  //near plane
  var out = unproject([], [64, 127, 0], viewport, invProj)
  t.deepEqual(out.slice(0, 2), [0, 0], 'at world centre')
  almostEqual(out, [0, 0, -3])

  //far plane
  out = unproject([], [64, 127, 1], viewport, invProj)
  t.deepEqual(out.slice(0, 2), [0, 0], 'at world centre')
  almostEqual(out, [0, 0, -5])
  t.end()
})