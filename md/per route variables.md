Fresh provides a way to declare variables only once when a route is first loaded. The variables never reset on route change as opposed to classic `const`s and `let`s.

## Declaring a per route variable
Per route variables are declared with a string, the variable's name is prepended with the "init" keyword.

An example:
```
"init myVariable"
```

## Changing a per route variable's value
Changing a per route variable's value is as simple as calling

```
$var.myVariable = 5
```

This snippet changed `myVariable`'s value to 5. It can even be simplified to

```
myVariable = 5
```

but it's recommended to use the `$var` alias for clarity.
